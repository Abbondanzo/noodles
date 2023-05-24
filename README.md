<div style="text-align:center;">
<img width="300" src="https://raw.githubusercontent.com/Abbondanzo/noodles/master/src/views/partials/nood-logo.svg" />
</div>

# Noodles

https://nood.pics/

Send me spicy noods. Preferably pictures. Lasagna, ramen, spaghetti--heck, even tortelloni. This project is your one-stop shop for all things noodles.

## Motivation

This is a pet project I created after a friend reached out to our group chat. He was about to let go of this wonderful domain, and I could not let it go to waste. Originally, it was his idea and so I give him full credit. I'm just the poor sucker who threw several nights at this to code it.

## How it works

There are three main folders in this project: `data/`, `scripts/`, and `src/`.

### `data/`

All of the raw data that this project uses can be found here. Stuff like photos, brand information, categories, comments, etc. Any files that end in a `.txt` is newline delimited. The `brands.yaml` file is custom information that gets converted to JSON.

### `scripts/`

All of the scripts here are executed to build/copy/move data and assets around. It's where the context object is built before getting sent through the root router

### `src/`

Here's everything else: uncompiled assets, routers, stylesheets, and the Pug templates used to power most of the pages. The routers are specifically designed so that the development and production experiences are identical.

## How to add data

See ["How to add data"](./data/README.md)

## How to run it

### Development

1. First, install dependencies from the root of the project

   ```bash
   $ npm install
   ```

1. Run the development server

   ```bash
   $ npm run serve
   ```

### Build

Install the dependencies and run:

```bash
$ npm run build
```

This will output everything into a `dist/` folder
