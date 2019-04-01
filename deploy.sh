if [ $# -gt 0 ]; then
  if [ "$2" == "create" ]; then
      echo "Creating lambda in $1 environment"
      claudia create --version $1 --region us-west-2 --api-module app
  elif [ "$2" == "--config" ]; then
    echo "Updating lambda in $1 environment using claudia config $3"
    claudia update --config $3 --version $1 --region us-west-2 --api-module app
  else
      echo "Updating lambda in $1 environment"
      claudia update --version $1 --region us-west-2 --api-module app
  fi
else
    echo "You must specify environment as first argument."
fi
