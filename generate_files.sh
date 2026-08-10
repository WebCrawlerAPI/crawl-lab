#!/bin/bash

LOREM="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "

# Create 100KB file
> public/100kb.txt
while [ $(wc -c < public/100kb.txt) -lt 102400 ]; do
    echo -n "$LOREM" >> public/100kb.txt
done

# Create 1MB file
> public/1mb.txt
while [ $(wc -c < public/1mb.txt) -lt 1048576 ]; do
    echo -n "$LOREM" >> public/1mb.txt
done

# Create 10MB file
> public/10mb.txt
while [ $(wc -c < public/10mb.txt) -lt 10485760 ]; do
    echo -n "$LOREM" >> public/10mb.txt
done

echo "Files generated successfully:"
ls -lh public/*.txt
