import {
  Page,
  Layout,
  Card,
  DataTable,
  Toast,
  Frame,
  Text,
  TextField,
  Button,
  Banner,
} from "@shopify/polaris";

import { useEffect, useState } from "react";

export default function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [toastActive, setToastActive] = useState(false);

  // ✅ Threshold saved in localStorage
  const [threshold, setThreshold] = useState(() => {
    return localStorage.getItem("lowStockThreshold") || "5";
  });

  const [loading, setLoading] = useState(false);

  // ✅ Save threshold whenever user types
  useEffect(() => {
    localStorage.setItem("lowStockThreshold", threshold);
  }, [threshold]);

  async function loadLowStockProducts() {
    setLoading(true);

    const res = await fetch(`/api/low-stock?threshold=${threshold}`);
    const data = await res.json();

    setProducts(data.products);

    if (data.products.length > 0) {
      setToastActive(true);
    }

    setLoading(false);
  }

  // Load products on page open
  useEffect(() => {
    loadLowStockProducts();
  }, []);

  const rows = products.map((p) => [
    <a
      href={`shopify:admin/products/${p.id.split("/").pop()}`}
      target="_blank"
      rel="noreferrer"
    >
      {p.title}
    </a>,
    p.stock,
    p.suggestedReorder,
  ]);

  return (
    <Frame>
      <Page title="Low Stock Alerts">
        {toastActive && (
          <Toast
            content="⚠️ Low stock products detected!"
            onDismiss={() => setToastActive(false)}
          />
        )}

        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Text variant="headingMd">Low Stock Products List</Text>

              <TextField
                label="Low Stock Threshold"
                type="number"
                value={threshold}
                onChange={(value) => setThreshold(value)}
                autoComplete="off"
              />

              <br />

              <Button onClick={loadLowStockProducts}>
                Refresh Alerts
              </Button>

              <br />
              <br />

              {/* ✅ Banner */}
              {products.length > 0 && products.length < 10 && (
                <>
                  <Banner status="warning">
                    ⚠️ Only {products.length} products are low in stock! Please
                    reorder soon.
                  </Banner>
                  <br />
                </>
              )}

              {/* Table / Empty / Loading */}
              {loading ? (
                <Text>Loading inventory...</Text>
              ) : products.length === 0 ? (
                <Text>No low stock products 🎉</Text>
              ) : (
                <DataTable
                  columnContentTypes={["text", "numeric", "numeric"]}
                  headings={[
                    "Product Name",
                    "Stock Left",
                    "Suggested Reorder Qty",
                  ]}
                  rows={rows}
                />
              )}
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}