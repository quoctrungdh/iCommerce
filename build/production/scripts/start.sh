declare -a array=("docker" "kubectl" "linkerd")

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

function startScript() {
  _out 👉 Installing services on production mode
  ./build/base/scripts/install-deps.sh -e production
  ./build/base/scripts/install-services.sh -e production
}



for i in "${array[@]}"
  do
    if which $i >/dev/null
    then
      echo ✅ $i is on your machine
    else
      echo ❌ $i  is NOT installed on your machine
      echo "👉 Please make sure that [ ${array[@]} ] are installed on your machine" 
      exit;
    fi
done
startScript