## More Directives



## While you were gone
```
{
    name: "Sound of Music",
    gross: 163.2,
    release: new Date('1965-03-29'),
    inCollection: true,
    shortDescription: 'A woman leaves an Austrian convent to become a governess to the children of a Naval officer Widower.',
    actors: [
        "Julie Andrews",
        "Christopher Plummer",
        "Eleanor Parker",
        "Richard Haydn",
        "Peggy Wood",
        "Charmian Carr",
        ...
    ],
    longDescription: "A tuneful, heartwarming story, it is based on the real life story of the Von Trapp Family singers, one of the world's best-known concert groups in the era immediately preceding World War II. Julie Andrews plays the role of Maria, the tomboyish postulant at an Austrian abbey who becomes a governess in the home of a widowed naval captain with seven children, and brings a new love of life and music into the home."
}
```

Note:
we added some more data!
Let's display but now with tabs!


## Add Tabs
```html
<section>
    <ul class='nav nav-tabs'>
        <li><a href>Description</a></li>
        <li><a href>Cast</a></li>
    </ul>
</section>
```


## ngclick
```
<section>
    <ul class='nav nav-tabs'>
        <li><a href ng-click="tab = 1">Description</a></li>
        <li><a href ng-click="tab = 2">Cast</a></li>
    </ul>
    {{tab}}
</section>
```

Note:
ng-click is a new directive
when clicking on it, it takes an action (in this case changing the value of tab)


## Add panels
```
<section>
    <ul class='nav nav-tabs'>
    ...
    <div class="panel" ng-show="tab === 1">
        <h4>Description</h4>
        <blockquote>{{item.longDescription}}</blockquote>
    </div>
    <div class="panel" ng-show="tab === 2">
        <h4>Cast</h4>
        <table class='table'>
            <tr ng-repeat="member in item.cast">
                <td>{{member.name}}</td>
                <td>{{member.character}}</td>
            </tr>
        </table>
    </div>
</section>
```

Note:
using ng-show to test the value of tab


### nginit
Set an initial tab value
```
<section ng-init="tab=1">
```
Note:
Sets a value when loaded


### ngclass
Set the active tab
```
<ul class='nav nav-tabs'>
    <li ng-class="{active:tab === 1}"><a href ng-click="tab = 1">Description</a></li>
    <li ng-class="{active:tab === 2}"><a href ng-click="tab = 2">Cast</a></li>
</ul>
```
Note:
Sets a dynamic class based on a value



### This is starting to look a little ugly...
```
<section ng-init="tab=1">
    <ul class='nav nav-tabs'>
        <li ng-class="{active:tab === 1}"><a href ng-click="tab = 1">Description</a></li>
        <li ng-class="{active:tab === 2}"><a href ng-click="tab = 2">Cast</a></li>
    </ul>

    <div class="panel" ng-show="tab === 1">
        <h4>Description</h4>
        <blockquote>{{item.longDescription}}</blockquote>
    </div>
    <div class="panel" ng-show="tab === 2">
        <h4>Cast</h4>
        <table class='table'>
            <tr ng-repeat="member in item.cast">
                <td>{{member.name}}</td>
                <td>{{member.character}}</td>
            </tr>
        </table>
    </div>
</section>
```


### Move the logic into a controller
```
<section ng-controller="PanelController as panel">
    <ul class='nav nav-tabs'>
        <li ng-class="{active:panel.isTabSelected(1)}"><a href ng-click="panel.selectTab(1)">Description</a></li>
        <li ng-class="{active:panel.isTabSelected(2)}"><a href ng-click="panel.selectTab(2)">Cast</a></li>
    </ul>

    <div class="panel" ng-show="panel.isTabSelected(1)">
        <h4>Description</h4>
        <blockquote>{{item.longDescription}}</blockquote>
    </div>
    <div class="panel" ng-show="panel.isTabSelected(2)">
        <h4>Cast</h4>
        <table class='table'>
            <tr ng-repeat="member in item.cast">
                <td>{{member.name}}</td>
                <td>{{member.character}}</td>
            </tr>
        </table>
    </div>
</section>
```


### Move the logic into a controller
```
app.controller('PanelController', function(){
    this.tab = 1;

    this.selectTab = function(setTab){
        this.tab = setTab;
    };

    this.isTabSelected = function(checkTab){
        return this.tab === checkTab;
    };
});
```
