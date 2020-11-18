// Your GraphQL schema defines what types of data a client can read and write to your data graph

// Fetch a list of all upcoming rocket launches
// Fetch a specific launch by its ID
// Log in the user
// Book a launch for a logged-in user
// Cancel a previously booked launch for a logged-in user

// Because the schema sits directly between your application clients and your underlying data services, front-end and back-end teams should collaborate on its structure. When you develop your own data graph, practice schema-first development and agree on a schema before you begin implementing your API.

const { gql } = require("apollo-server");

const typeDefs = gql`
  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }
  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }
  enum PatchSize {
    SMALL
    LARGE
  }

  type Query {
    launches(pageSize: Int, after: String): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Mutation {
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }
`;

// An exclamation point (!) after a declared field's type means "this field's value can never be null."

// If a declared field's type is in [Square Brackets], it's an array of the specified type
module.exports = typeDefs;
