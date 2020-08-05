# Parallel from list of jenkins in action

# Scenario

A jenkins pipeline job which will trigger downstream jobs N times according to the length of a given parameter:
Something like this:

```jenkins
USERS:
- user1
- user2
- user3
- user4
```

This will trigger downstream job 4 times.

# First approach

At the first, I use a for loop to do this:

```groovy
for (u in USERS) {
 build job: 'DownstreamJob', parameters: [
      string(name: 'param1', value: u)]
}
```

But there are 2 points will be figured out here are

- without `wait: false` each job will block the main thread, so will spend too much time to wait each job to be finished
- even with `wait: true`, we still can not know when each job is finished, maybe need other logic to monitor each build

# Second approach

Then I found `parallel`, It has a example for [parallel from list](https://jenkins.io/doc/pipeline/examples/#parallel-from-list)
Since the parallel statement is in a `stage` scope, so we can not define the function in the stage scope. After a while with checking the groovy syntax, I found groovy support closure and also can be used in `stage` scope.

```groovy
stage ("test") {
 def transformIntoStep { u ->
  build job: 'DownstreamJob', parameters: [
       string(name: 'param1', value: u)]
 }
 def stepsForParallel = USERS.collectEntries {
     ["echoing ${it}" : transformIntoStep(it)]
 }
 parallel stepsForParallel
}
```

In theory, parallel will wait all the downstream jobs triggered and the total time is the longest job.
But I found this can not work, since it will report error is this usage can not be a closure with parameters.

# Third approach

Then I found that I can make a wrapper to make the argument closure as an anonymous closure:

```groovy
stage ("test") {
 def transformIntoStep { u ->
  build job: 'DownstreamJob', parameters: [
       string(name: 'param1', value: u)]
 }
 def stepsForParallel = USERS.collectEntries {
     ["echoing ${it}" : { transformIntoStep(it) }]
 }
 parallel stepsForParallel
}
```

Finally, this works!
Then I found that I have to note down all the triggered jobs ID. So make another approach.

# Final approach

Since I make all triggered jobs ID array as a global variable, so need add another argument to the closure:

```groovy
def JOB_IDS=[]
stage ("test") {
 def transformIntoStep { u, ids ->
  id = build job: 'DownstreamJob', parameters: [
       string(name: 'param1', value: u)]
     ids.push(id)
 }
 def stepsForParallel = USERS.collectEntries {
     ["echoing ${it}" : { transformIntoStep(it, JOB_IDS) }]
 }
 parallel stepsForParallel
}
```

# That’s all!