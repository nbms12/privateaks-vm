# privateaks-vm
aim : create private aks cluster , one vm can access to aks were 1 pod inside one node is running.

installation steps: 

1 az group create --name rg-private-aks --location eastus


2.Create Virtual Network with 2 Subnets

# Create VNet
az network vnet create \
    --resource-group rg-private-aks \
    --name vnet-private-aks \
    --address-prefixes 10.0.0.0/16

# Create AKS subnet
az network vnet subnet create \
    --resource-group rg-private-aks \
    --vnet-name vnet-private-aks \
    --name subnet-aks \
    --address-prefixes 10.0.1.0/24

# Create VM subnet
az network vnet subnet create \
    --resource-group rg-private-aks \
    --vnet-name vnet-private-aks \
    --name subnet-vm \
    --address-prefixes 10.0.2.0/24


3. Create Private AKS Cluster
			
			az vm create --resource-group rg-private-aks --name vm-aks-access --image Ubuntu2204 --vnet-name vnet-private-aks --subnet subnet-vm --admin-username azureuser --size Standard_B2s --generate-ssh-keys
			
			set context > 	az aks get-credentials --resource-group rg-private-aks --name aks-private-cluster



4. create vm

   az vm create --resource-group rg-private-aks --name vm-aks-access --image Ubuntu2204 --vnet-name vnet-private-aks --subnet subnet-vm --admin-username azureuser --size Standard_B2s --generate-ssh-keys


5. Configure AKS Access from VM

# SSH to VM
ssh azureuser@$VM_IP

# Inside VM - Install tools
sudo apt-get update
sudo apt-get install -y curl

# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install kubectl
sudo az aks install-cli

# Login to Azure (you'll need to authenticate)
az login

# Get AKS credentials
az aks get-credentials \
    --resource-group rg-private-aks \
    --name aks-private-cluster

# Test access
kubectl get nodes
kubectl cluster-info


6. Verify

# Check cluster connectivity
kubectl get nodes

# Check if API server is accessible
kubectl get pods --all-namespaces

# Test DNS resolution inside cluster
kubectl run test --image=busybox --rm -it --restart=Never -- nslookup kubernetes.default


7. Deploy Test Application

   # Create a test deployment
kubectl create deployment nginx-test --image=nginx

# Expose it internally
kubectl expose deployment nginx-test --port=80

# Verify it's running
kubectl get pods,svc

8. Cleanup

az group delete --name rg-private-aks --yes --no-wait
