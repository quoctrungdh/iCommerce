declare -a array=("docker" "kubectl" "k3d")

function _out() {
  echo "$(date +'%F %H:%M:%S') $@"
}

function startScript() {
  _out 👉 Installing services on development mode
  ./build/dev/scripts/create-cluster.sh
  ./build/base/scripts/install-deps.sh -e dev
  ./build/base/scripts/install-services.sh -e dev
}

if which "k3d" >/dev/null
  then
    echo ✅ "k3d" is on your machine
  else
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      wget -q -O - https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash
    elif [[ "$OSTYPE" == "darwin"* ]]; then
      brew install k3d
    else
      echo "You OS is not suppoted K3D. Please see more: https://k3d.io/"
      exit;
    fi
fi

for i in "${array[@]}"
  do
    if which $i >/dev/null
    then
      echo ✅ $i : OK
    else
      echo ❌ $i  is NOT installed on your machine
      echo "👉 Please make sure that [ ${array[@]} ] are installed on your machine" 
      exit;
    fi
done

startScript