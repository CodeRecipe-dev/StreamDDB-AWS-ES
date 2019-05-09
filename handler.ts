import { APIGatewayProxyEvent } from "aws-lambda";
import { indexElasticSearch } from "./streams/process";


export async function processStreams(event: APIGatewayProxyEvent) {
  await indexElasticSearch(event);
}
