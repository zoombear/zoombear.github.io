## More Data
```
var movie = {
    name: "Sound of Music",
    gross: 163.2,
    release: new Date('1965-03-29'),
    inCollection: true,
    shortDescription: 'A woman leaves an Austrian convent to become a governess to the children of a Naval officer Widower.'
};
```

```
app.controller('CollectionController', function(){
    this.item = movie;
});
```

Note: Bad way: collection.item[0].name, etc.


## Adding functionality
```
<div ng-controller="CollectionController as collection">
    <div>
        <h2>
            {{collection.item.name}}
            <span>{{collection.item.release}}</span>
        </h2>
        <h3>International Gross: ${{collection.item.gross}}<h3>
        <div>
            <p>{{collection.item.shortDescription}}</p>
        </div>
        <h3>(In your collection)</h3>
    </div>
</div>
```
Expand our list to hold thing I plan to collect.
Show a little message indicating when it's in the collection

Note: Let's say I want to expand my collection to hold movies that I don't own. And wanted to add a little text to the view indicate that


## Adding Functionality: ngshow directive
```
var movie = {
    name: "Sound of Music",
    gross: 163.2,
    release: new Date('1965-03-29'),
    inCollection: true,
    shortDescription: 'A woman leaves an Austrian convent to become a governess to the children of a Naval officer Widower.'
};
```

```
<div ng-controller="CollectionController as collection">
    <div>
        <h2>
            {{collection.item.name}}
            <span>{{collection.item.release}}</span>
        </h2>
        <h3>International Gross: ${{collection.item.gross}}<h3>
        <div>
            <p>{{collection.item.shortDescription}}</p>
        </div>
        <h3 ng-show="{{collection.item.inCollection}}">(In your collection)</h3>
    </div>
</div>
```
<!-- .element: class="fragment" -->


## Adding Functionality: NgHide Directive
```
var movie = {
    name: "Sound of Music",
    gross: 163.2,
    release: new Date('1965-03-29'),
    inCollection: true,
    shortDescription: 'A woman leaves an Austrian convent to become a governess to the children of a Naval officer Widower.',
    guiltyPleasure: false
};
```

```
<div ng-controller="CollectionController as collection">
    <div ng-hide="{{!collection.item.guiltyPleasure}}">
        <h2>
            {{collection.item.name}}
            <span>{{collection.item.release}}</span>
        </h2>
        <h3>International Gross: ${{collection.item.gross}}<h3>
        <div>
            <p>{{collection.item.shortDescription}}</p>
        </div>
        <h3 ng-show="{{collection.item.inCollection}}">(In your collection)</h3>
    </div>
</div>
```
<!-- .element: class="fragment" -->

Note: When you want to hide something when a condition is true
IE. You want to hide your guilty pleasure films


## Filters
Let's clean up that [date](https://docs.angularjs.org/api/ng/filter/date)
```
<div ng-controller="CollectionController as collection">
    <div>
        <h2>
            {{collection.item.name}}
            <span>{{collection.item.release | date:'mediumDate'}}</span>
        </h2>
        <h3>International Gross: ${{collection.item.gross}}<h3>
        <div>
            <p>{{collection.item.shortDescription}}</p>
        </div>
    </div>
</div>
```

Note:
- Well that's all nice but what's with that date, tho?
sample custom filter
myApp.filter('reverse', function () {
  return function (text) {
    return text.split("").reverse().join("");
  }
});


## Filters
And the revenue
```
<div ng-controller="CollectionController as collection">
    <div>
        <h2>
            {{collection.item.name}}
            <span>{{collection.item.release | date:'mediumDate'}}</span>
        </h2>
        <h3>International Gross: ${{collection.item.gross * 1000000 | currency:'$' }}<h3>
        <div>
            <p>{{collection.item.shortDescription}}</p>
        </div>
    </div>
</div>
```


## More Built-in Filters
[https://docs.angularjs.org/api/ng/filter](https://docs.angularjs.org/api/ng/filter)


## More Data
```
var movies = [
    {
        name: "Sound of Music",
        gross: 163.2,
        release: new Date('1965-03-29'),
        inCollection: true,
        shortDescription: 'A woman leaves an Austrian convent to become a governess to the children of a Naval officer Widower.'
    },
    {
        name: "Mary Poppins",
        gross: 102.3,
        release: new Date('1964-09-11'),
        inCollection: false,
        shortDescription: "A magic nanny comes to work for a cold banker's unhappy family",
    }
];

```
```
app.controller('CollectionController', function(){
    this.items = movies;
});
```


## NgRepeat
```
<div ng-repeat="item in collection.items">
    <h2>
        {{item.name}}
        <span>{{item.release | date:'mediumDate'}}</span>
    </h2>
    <h3>International Gross: {{item.gross * 1000000 | currency:'$'}}<h3>
    <div>
        <p>{{item.shortDescription}}</p>
    </div>
    <h3 ng-show="{{item.inCollection}}">(In your collection)</h3>
</div>
```
Note: show good way
