<#
 # Build and deploy GitHub pages based documentation
 # npm run builddocs
 #>

try {
    rmdir -Path docs/.vuepress/dist -Recurse -Force -ErrorAction "SilentlyContinue"
} catch {
    write-host 'docs/.vuepress/dist does not exist'
}
vuepress build docs
cd docs/.vuepress/dist
git init
git checkout -b gh-pages
git add -A
git commit -m 'deploy'
git remote add origin https://github.com/TotallyInformation/node-red-contrib-infocache.git
git branch --set-upstream-to origin/gh-pages
git push -f -u origin gh-pages:gh-pages
cd ../..

<#
 # Only run the rest of this ONCE!

# build
npm run builddocs

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
#git push -f git@github.com:TotallyInformation/node-red-contrib-infocache.git master:gh-pages

git remote add origin https://github.com/TotallyInformation/node-red-contrib-infocache.git
git branch --set-upstream-to origin/gh-pages
git push -f -u origin master:gh-pages

cd ../..

 #>