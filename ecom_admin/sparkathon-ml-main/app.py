import streamlit as st
import pandas as pd
from prophet import Prophet
import plotly.express as px
import os

st.set_page_config(page_title="Smart Forecast & Rebalancer", layout="wide")
st.title("📊 Demand Forecasting & 🔁 Auto Rebalancer")


st.sidebar.header("📁 Upload Order Data")
uploaded_file = st.sidebar.file_uploader("Upload your orders.csv", type=["csv"])

if uploaded_file:
    orders = pd.read_csv(uploaded_file)
    orders['date'] = pd.to_datetime(orders['date'])

    st.success("✅ orders.csv uploaded and loaded!")

    test="Being tested by naved"

    st.header("📈 Forecasting Dashboard")

    def forecast_sku_wh(df, sku_id, wh_id, periods=30):
        df_filtered = df[(df['sku_id'] == sku_id) & (df['warehouse_id'] == wh_id)]
        daily = df_filtered.groupby('date')['quantity_sold'].sum().reset_index()
        daily = daily.rename(columns={'date': 'ds', 'quantity_sold': 'y'})
        all_dates = pd.date_range(start=daily['ds'].min(), end=daily['ds'].max())
        daily = daily.set_index('ds').reindex(all_dates).fillna(0).rename_axis('ds').reset_index()
        m = Prophet(weekly_seasonality=True, yearly_seasonality=False, daily_seasonality=False)
        m.fit(daily)
        future = m.make_future_dataframe(periods=periods)
        forecast = m.predict(future)
        forecast_out = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        forecast_out['sku_id'] = sku_id
        forecast_out['warehouse_id'] = wh_id
        return forecast_out

    sku_wh_pairs = orders[['sku_id', 'warehouse_id']].drop_duplicates()
    forecasts = []

    with st.spinner("Running forecast models..."):
        for _, row in sku_wh_pairs.iterrows():
            try:
                forecast_df = forecast_sku_wh(orders, row['sku_id'], row['warehouse_id'])
                forecasts.append(forecast_df)
            except:
                continue

    full_forecast_df = pd.concat(forecasts, ignore_index=True)
    full_forecast_df.to_csv("full_forecast.csv", index=False)

    st.success("✅ Forecasts generated!")

    
    st.subheader("📊 Forecast Viewer")
    sku_options = full_forecast_df['sku_id'].unique()
    sku_selected = st.selectbox("Select SKU", sku_options)
    wh_options = full_forecast_df[full_forecast_df['sku_id'] == sku_selected]['warehouse_id'].unique()
    wh_selected = st.selectbox("Select Warehouse", wh_options)

    plot_df = full_forecast_df[
        (full_forecast_df['sku_id'] == sku_selected) & (full_forecast_df['warehouse_id'] == wh_selected)
    ]

    fig = px.line(plot_df, x='ds', y='yhat', title=f"Forecast for {sku_selected} at {wh_selected}",
                  labels={'ds': 'Date', 'yhat': 'Predicted Demand'})
    st.plotly_chart(fig, use_container_width=True)

    
    st.download_button("📥 Download Full Forecast CSV", full_forecast_df.to_csv(index=False), file_name="full_forecast.csv")

    
    st.header("🔁 Auto Rebalancer")

    inventory_file = st.file_uploader("Upload warehouse_inventory.csv", type=["csv"], key='inv')
    if inventory_file:
        inventory_df = pd.read_csv(inventory_file)

        def compute_inventory_gaps(forecast_df, inventory_df, forecast_days=7):
            demand_records = []
            sku_wh_groups = forecast_df.groupby(['sku_id', 'warehouse_id'])
            for (sku, wh), group in sku_wh_groups:
                future = group.sort_values('ds').head(forecast_days)
                forecasted_demand = future['yhat'].sum()
                inv_row = inventory_df[
                    (inventory_df['sku_id'] == sku) & (inventory_df['warehouse_id'] == wh)
                ]
                if inv_row.empty:
                    continue
                current_inventory = inv_row.iloc[0]['current_inventory']
                gap = current_inventory - forecasted_demand
                demand_records.append({
                    'sku_id': sku,
                    'warehouse_id': wh,
                    'forecasted_demand': round(forecasted_demand),
                    'current_inventory': current_inventory,
                    'gap': round(gap)
                })
            return pd.DataFrame(demand_records)

        def suggest_transfers(gap_df, min_transfer=10):
            transfer_suggestions = []
            skus = gap_df['sku_id'].unique()
            for sku in skus:
                sku_data = gap_df[gap_df['sku_id'] == sku]
                shortage_whs = sku_data[sku_data['gap'] < 0].sort_values('gap')
                surplus_whs  = sku_data[sku_data['gap'] > min_transfer].sort_values('gap', ascending=False)
                for _, shortage in shortage_whs.iterrows():
                    needed = abs(shortage['gap'])
                    for _, surplus in surplus_whs.iterrows():
                        if surplus['gap'] > 0:
                            transfer_qty = min(needed, surplus['gap'])
                            transfer_suggestions.append({
                                'sku_id': sku,
                                'from_warehouse': surplus['warehouse_id'],
                                'to_warehouse': shortage['warehouse_id'],
                                'quantity': int(transfer_qty)
                            })
                            surplus_whs.loc[surplus_whs['warehouse_id'] == surplus['warehouse_id'], 'gap'] -= transfer_qty
                            needed -= transfer_qty
                            if needed <= 0:
                                break
            return pd.DataFrame(transfer_suggestions)

        with st.spinner("Running rebalancer..."):
            gap_df = compute_inventory_gaps(full_forecast_df, inventory_df)
            transfer_df = suggest_transfers(gap_df)
            transfer_df.to_csv('transfer_plan.csv', index=False)

        st.success("✅ Rebalance Transfer Plan Ready!")
        st.download_button("📥 Download Transfer Plan CSV", transfer_df.to_csv(index=False), file_name="transfer_plan.csv")

        st.subheader("🚨 Low Stock Alerts")
        low_stock = gap_df[gap_df['gap'] < 0].copy()
        if low_stock.empty:
            st.success("🎉 No low stock alerts! All warehouses are sufficiently stocked.")
        else:
            for _, row in low_stock.iterrows():
                st.warning(f"⚠️ SKU `{row['sku_id']}` at `{row['warehouse_id']}` is short by **{abs(row['gap'])} units** (Demand: {int(row['forecasted_demand'])}, Inventory: {int(row['current_inventory'])})")

        st.subheader("📋 Transfer Table")
        if transfer_df.empty and not low_stock.empty:
            st.warning("⚠️ Stock shortages detected, but no transfers were possible. Likely due to insufficient surplus at other warehouses.")
        elif transfer_df.empty:
            st.success("✅ No updated transfer tables required. All SKUs are sufficiently balanced across warehouses.")
        else:
            sku_filter = st.selectbox("Filter by SKU", ["All"] + sorted(transfer_df['sku_id'].unique()))
            filtered_df = transfer_df.copy()
            if sku_filter != "All":
                filtered_df = filtered_df[transfer_df['sku_id'] == sku_filter]
            st.dataframe(filtered_df, use_container_width=True)

            st.subheader("📊 Transfers by SKU")
            summary = filtered_df.groupby('sku_id')['quantity'].sum().reset_index().sort_values(by='quantity', ascending=False)
            fig2 = px.bar(summary, x='sku_id', y='quantity', title='Total Quantity to be Transferred per SKU')
            st.plotly_chart(fig2, use_container_width=True)

            st.download_button("📥 Download Filtered Transfer Plan", filtered_df.to_csv(index=False), file_name="filtered_transfer_plan.csv")
