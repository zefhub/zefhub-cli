const graphql = `# GraphQL schema generated with zefhub cli.
# Zef.SchemaVersion: v1
# Zef.Authentication: {"Algo": "HS256", "VerificationKey": "xxxxxxxx", "Header": "X-Auth-Token"}

type User @hook(onCreate: "userCreate") {
  id: ID!
  name: String!
  email: String!
}
`;

export default graphql;
