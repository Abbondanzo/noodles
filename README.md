<div style="text-align:center;">
<img width="300" src="https://raw.githubusercontent.com/Abbondanzo/noodles/master/src/views/partials/nood-logo.svg" />
</div>

# Noodles

https://nood.pictures/

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

Adding data is pretty simple. Navigate to any of the files in the `data/` folder and simply edit them. Changes that get approved will automatically get built into the website. For example, if you'd like to modify or add a title, open the `titles.txt` file and place your entry on a newline. All files that end in `.txt` are delimited by newlines.

### Adding brands

The `brand.yml` file within the `data/` folder is a bit special: it is a YAML file that follows a specific formatting. Each brand must start with the `- name` key. Sites also have a `- name` key but at a greater depth, and must also include a `url` key after that. Attributes are any valid key/value pair.

### Adding photos

There are a few steps you should take before adding photos:

1. Strip all EXIF data so weirdos on the Internet cannot pinpoint your address from the photo
1. Compress the image using a tool like [imagecompressor.com](https://imagecompressor.com/). This discards meaningless data and makes downloading the fullsize image faster.
1. Follow the existing naming convention. So, for example, if the most recent file is `38.jpg`, you should name your file `39.jpg`. Counting!

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
