import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticate } from "app/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  
  // Corrected GraphQL query to fetch just product names
  const response = await admin.graphql(`
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `);

  const data = await response.json();
  
  return json({
    products: data.data.products.edges,
  });
};

export default function Index() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h1>My Shopify Products</h1>
      <div>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {products.map((product: any) => (
              <div
                key={product.node.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <h3>{product.node.title}</h3>
                <p>ID: {product.node.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}