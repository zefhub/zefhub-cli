const graphql = `# GraphQL schema generated with zefhub cli.
# Zef.SchemaVersion: v1
# Zef.Authentication: {"Algo": "HS256", "VerificationKey": "xxxxxxxx", "Audience": "example.com", "Header": "X-Auth-Token"}

type User @hook(onCreate: "userCreate") {
  name: String!
  email: String!
}
`;

export default graphql;
