Welcome to the documentation site for node-red-contrib-infocache.
If you need to raise an issue, bug report or enhancement request against infocache or its documentation, please do so on the [issues page]({{ site.github.issues_url }})

## Index of documents

1. [Design](./design.md) - documents the design and thinking behind infocache along with ideas for the future.

{% for page in site.pages %}
  * [{{ page.title }}]({{ page.html_url }})
{% endfor %}

## My other repositories

{% for repository in site.github.public_repositories %}
  * [{{ repository.name }}]({{ repository.html_url }})
{% endfor %}