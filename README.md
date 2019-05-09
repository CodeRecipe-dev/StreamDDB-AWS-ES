# Loading Streaming Data from Amazon DynamoDB to AWS ElasticSearch Service

by: Dasith kuruppu

More info here: https://coderecipe.ai/architectures/21264803

**Problem Statement:**

Loading streaming data from Amazon DynamoDB into Amazon ElasticSearch Service without reading through complex documentation such as [this](https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-aws-integrations.html#es-aws-integrations-dynamodb-es) 

**Solution:**

Use AWS Lambda to receive event notifications from DynamoDB using triggers. The lambda then runs custom code to parse the event and perform the indexing on AWS ElasticSearch. To quickly try out this solution, click on "Deploy Me".

### Prerequisites
```  
npm install serverless
```  
Make sure you have AWS access key and secrete keys setup locally, following this video [here](https://www.youtube.com/watch?v=KngM5bfpttA)

### Download the code locally

```  
serverless create --template-url https://github.com/CodeRecipe-dev/StreamDDB-AWS-ES --path StreamDDB-AWS-ES  
```

### Deploy to the cloud  

```
cd StreamDDB-AWS-ES

npm install

serverless deploy --stage <your-stage-name>
```
