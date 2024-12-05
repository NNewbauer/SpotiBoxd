import boto3

def get_secret(secret_name):
    client = boto3.client('secretsmanager', region_name='us-east-2')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']

try:
    secret = get_secret('spotiboxd/postgresql')
    print(secret)
except Exception as e:
    print(f"Error accessing Secrets Manager: {e}")