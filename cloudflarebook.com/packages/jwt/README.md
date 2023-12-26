# jwt

`jwt` is a fork of https://github.com/tsndr/cloudflare-worker-jwt - commit c4559460fb0f3eaf938dcba0f1a19a827a0b5dca - License: MIT


## Usage


```typescript
async () => {
    import jwt from '@tsndr/cloudflare-worker-jwt'

    // Creating a token
    const token = await jwt.sign({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        nbf: Math.floor(Date.now() / 1000), // Not before: Now
        exp: Math.floor(Date.now() / 1000) + (48 * (60 * 60)) // Expires: Now + 48h
    }, 'secret')

    // Verifying token
    const isValid = await jwt.verify(token, 'secret')

    // Check for validity
    if (!isValid)
        return

    // Decode token
    const { payload } = jwt.decode(token)
}
```
