# Storage

Fangorn uses Storacha for storage. In order to setup storage, you must follow this one time setup first. Note that storacha provide 5gb of storage for free (as of 12/2025).

## Step 1: (ONE TIME) Setup

``` sh
npm install -g @web3-storage/w3cli
w3 login <your-email>   # click the email
w3 space create FANGORN                 # if you haven't already
w3 space use <space-did>                # set it as current

# Create a key for your app
w3 key create
# This outputs something like: did:key:z6Mkh...

# Delegate upload permission to that key (output from cmd above)
w3 delegation create did:key:z6Mk... \
--can 'space/blob/add' \
--can 'space/index/add' \
--can 'filecoin/offer' \
--can 'upload/add' \
--base64


# allow all
w3 delegation create did:key:z6Mkfagmeg7y6BpwmrrTiHtSdsfuAvi4dyvRxUB6nUk4EmBK \
  --can '*' \
  --base64
```

## Step 2: Configure Environment Variables

Create a .env.local and configure

```
STORAGE_PRIVATE_KEY = 'MgCa...your-private-key'  // from w3 key create
STORAGE_PROOF = 'mAYI...your-base64-proof'        // from w3 delegation create
```