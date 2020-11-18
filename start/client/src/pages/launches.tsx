import React, { Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { gql, useQuery } from "@apollo/client";
import { LaunchTile, Header, Button, Loading } from "../components";
import * as GetLaunchListTypes from "./__generated__/GetLaunchList";
//  fragment is a piece of logic that a client can share between multiple queries and mutations.
export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

// define the shape of the query we'll use to fetch a paginated list of launches
// we include the LaunchTile fragment in our query by preceding it with ..., similar to JavaScript spread syntax.

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}
// We'll use Apollo Client's useQuery React Hook to execute our new query within the Launches component.
// This component passes our GET_LAUNCHES query to useQuery and obtains data, loading, and error properties from the result. 
// Depending on the state of those properties, we render a list of launches, a loading indicator, or an error message.

/**
 * 
 * there are more than 20 SpaceX launches in total. 
 * Our server paginates its results and includes a maximum of 20 launches in a single response.
 */

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error, fetchMore } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  // pagination support
  const [isLoadingMore, setIsLoadingMore] = useState(false);


  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches &&
        data.launches.hasMore &&
        (isLoadingMore ? (
          <Loading />
        ) : (
          <Button
            onClick={async () => {
              setIsLoadingMore(true);
              await fetchMore({
                variables: {
                  after: data.launches.cursor,
                },
              });
              setIsLoadingMore(false);
            }}
          >
            Load More
          </Button>
        ))}
    </Fragment>
  );
};

export default Launches;
