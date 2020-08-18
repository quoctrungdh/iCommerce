declare -a array=("docker" "kubectl" "k3d" "linkerd")

for i in "${array[@]}"
  do
    if which $i >/dev/null
    then
      echo ✅ $i
    else
      echo ❌ $i
    fi
done

