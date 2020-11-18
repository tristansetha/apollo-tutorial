// Data sources are classes that encapsulate fetching data from a particular service, with built-in support for caching, 
// deduplication, and error handling. You write the code that is specific to interacting with your backend, 
// and Apollo Server takes care of the rest.

const { RESTDataSource } = require("apollo-datasource-rest");

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.spacexdata.com/v2/";
  }

  async getAllLaunches() {
    // https://api.spacexdata.com/v2/launches
    const response = await this.get("launches");
    return Array.isArray(response)
      ? response.map((launch) => this.launchReducer(launch))
      : [];
  }
  // Using a reducer like this enables the getAllLaunches method to remain concise as our definition of a Launch potentially changes and grows over time.
  /**type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}
   * 
   * 
   * @param {*} launch 
   */
  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getLaunchById({ launchId }) {
    const response = await this.get("launches", { flight_number: launchId });
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }
}

module.exports = LaunchAPI;

// The RESTDataSource class automatically caches responses from REST resources with no additional setup. We call this feature partial query caching. It enables you to take advantage of the caching logic that the REST API already exposes.
