import shopify from "./shopify.js";

export async function getLowStockProducts(session, threshold = 5) {

  const client = new shopify.api.clients.Graphql({
    session,
  });

const query = `
{
  products(first: 50) {
    edges {
      node {
        id
        title
        variants(first: 5) {
          edges {
            node {
              inventoryQuantity
            }
          }
        }
      }
    }
  }
}
`;

  const response = await client.query({ data: query });

  const products = response.body.data.products.edges.map((edge) => {
    const product = edge.node;
    const stock =
      product.variants.edges[0].node.inventoryQuantity;

    return {
      id: product.id,
      title: product.title,
      stock,
      suggestedReorder: 20 - stock,
    };
  });

  return products.filter((p) => p.stock <= threshold);
}
