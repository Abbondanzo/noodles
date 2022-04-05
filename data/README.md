# How to add data

Adding data is pretty simple. Navigate to any of the files in the `data/` folder and simply edit them. Changes that get approved will automatically get built into the website. For example, if you'd like to modify or add a title, open the `titles.txt` file and place your entry on a newline. All files that end in `.txt` are delimited by newlines.

## Adding brands

The `brand.yml` file within the `data/` folder is a bit special: it is a YAML file that follows a specific formatting. Each brand must start with the `- name` key. Sites also have a `- name` key but at a greater depth, and must also include a `url` key after that. Attributes are any valid key/value pair.

## Adding photos

There are a few steps you should take before adding photos:

1. Strip all EXIF data so weirdos on the Internet cannot pinpoint your address from the photo
1. Compress the image using a tool like [imagecompressor.com](https://imagecompressor.com/). This discards meaningless data and makes downloading the fullsize image faster.
1. Follow the existing naming convention. So, for example, if the most recent file is `38.jpg`, you should name your file `39.jpg`. Counting!
