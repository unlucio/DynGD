# DynGD

DynGD is a simple script that does [Dynamic DNS](https://en.wikipedia.org/wiki/Dynamic_DNS) with your Godaddy domains.

## Configuration

DynGD takes 4 environment variable:

- DOMAIN: your domain name. ex: `example.com`
- DOMAIN_NAMES: comma separated list of subdomains you wish to associate with your IP. ex: `home, vpn, private`
- GD_SECRET and GD_KEY: API access credentials you can generate at [https://developer.godaddy.com/keys](https://developer.godaddy.com/keys)

This will associate `home.example.com`, `vpn.example.com`, `private.example.com` with your conenction IP

##Running it:
You can of course always run it with a `node index.js` or `npm start` just like every other node project.
Yet the best and most convinient way is using docker:

```sh
docker run -d -it \
  -e GD_KEY="<your very secret key>" \
  -e GD_SECRET="<your very secret secret>" \
  -e DOMAIN_NAMES="your, list, of, host, names"
  -e DOMAIN="your_domain.org" \
  --name updatedns \
  unlucio/dyngd
```

## Can I use wildcards?

Yes you can. Indeed I my self run it with the following option:

```sh
DOMAIN_NAMES="*, @"
```

## My IP changed, and now?

You will need to run DynGD every time your IP changes, so your DNS is kept up to date.
How you do that it's your choice and prerogative. I my self I just run it every 5 mins weitht he help of good old chron

```sh
*/5 * * * * docker start updatedns
```

DynGD will check and do its thing only if needed, so it's safe to run whenever you like.

## Issues

I'd rather you open a PR than an issue.
