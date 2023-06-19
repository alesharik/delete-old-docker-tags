#!/bin/bash
pushd . || exit 1
cd "$( dirname -- "$0"; )" || exit 1
for (( i = 0; i < 20; i++ )); do
  echo "$i" > tmp.txt # Required to generate unique containers with unique hashes
  docker build -t "localhost:5000/test:v1.$i" .
  docker push "localhost:5000/test:v1.$i"
  docker image rm "localhost:5000/test:v1.$i"
  rm "tmp.txt"
done
popd || exit 1
