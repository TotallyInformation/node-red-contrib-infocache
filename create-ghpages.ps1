# NOTE: Either stash changes or commit them before running

# First create a new empty branch called `gh-pages`
git checkout --orphan newroot

# Then remove all files
git rm -rf .
# Warning, some files might need admin to remove

# Then commit the empty branch
git commit --allow-empty -m 'root commit'

# Finally push to new upstream branch
git push --set-upstream origin gh-pages

# And switch back to master
git checkout newroot