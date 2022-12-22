import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export function getSSMParameter(scope: Construct, key: string) {
  return ssm.StringParameter.valueForStringParameter(scope, key);
}
