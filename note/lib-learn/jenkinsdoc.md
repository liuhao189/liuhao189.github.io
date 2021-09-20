# Jenkins官方文档笔记

# 准备工作

机器要求：256RAM，推荐512RAM。

依赖软件：Java8，Docker。

# 下载并运行 Jenkis

1、下载 [Jenkins](https://mirrors.jenkins.io/war-stable/latest/jenkins.war)

2、终端执行 java -jar jenkins.war --httpPort=8080

3、打开浏览器进入链接 http://localhost:8080，完成安装。

# 第一个 Pipeline

## 什么是Jenkins Pipeline

Jenkins Pipeline 是一套插件，将持续交付的实现和实施集成到 Jenkins中。

持续交付 Pipeline 自动化的表达了这样一种流程，将基于版本控制管理的软件持续的交付到您的用户和消费者手中。

Jenkins Pipeline 提供一套可扩展的工具，用于将“简单到复杂”的交付流程实现为“持续交付即代码”。Jenkins Pipeline 的定义通常被写入一个文本文件中（Jenkinsfile）。该文件可以被放入项目的源代码控制库中。


## 执行多个步骤

Pipelines 由多个步骤组成，允许你构建、测试和部署应用。Jenkins Pipeline 允许您使用一种简单的方式组合多个步骤，以帮助您实现多种类型的自动化构建过程。

把步骤看作一个执行单一动作的单一的命令，当一个步骤运行成功时继续运行下一个步骤，当任何一个步骤失败时，Pipeline 的执行结果也为失败。当所有的步骤都执行完成并且为成功时，pipeline 的执行结果为成功。

Jenkinsfile

```js
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'echo "Hello World"'
        sh 'exit 0'
      }
    }
  }
}
```

### 超时&&重试

Jenkins Pipeline提供了很多的步骤，这些步骤可以相互组合嵌套，方便地解决像重复执行步骤直到成功和如果一个步骤执行花费的时间太长则退出等问题。

```js
pipeline {
  agent any
  stages {
    stage('Depoly') {
      steps {
        retry(3) {
          sh './deploy.sh'
        }
        timeout(time: 3, units: 'MINUTES') {
          sh './health-check.sh'
        } 
      }
    }
  }
}
```
### 完成时动作

当 pipeline运行完成时，需要做一些清理或者基于 pipeline 的运行结果执行不同的操作。

```js
pipeline {
  agent any
  stages {
    stage('Test') {
      steps {
        sh 'echo "Fail!";exit 1'
      }
    }
    post {
      always {
        echo 'This will always run'
      }
      success {
        echo 'This will run only if successful'
      }
      failure {
        echo 'This will run only if failed'
      }
      unstable {
        echo 'This will run only if the run was marked as unstable'
      }
      changed {
        echo 'This will run only if the state of the Pipeline has changed'
        echo 'Fox example, if the pipeline was previously failing but is now successful'
      }
    }
  }
}
```
## 定义执行环境

agent 指令告诉 Jenkins 在哪里以及如何执行Pipeline 或Pipeline 的子集。

在执行引擎中，agent 指令会引起一下操作的执行：

1、所有在块 block 中的步骤 steps 会被 Jenkins 保存在一个执行队列中。一旦一个执行器 executor 是可以利用的，这些步骤将会开始执行。

2、一个工作空间 workspace将会被分配，工作空间中包含来自远程仓库的文件和一些用于 Pipeline 的工作文件。

在 Pipeline 中可以很容易地运行 Docker 镜像和容器，Pipeline 可以定义命令或者应用运行需要的环境和工具，不需要执行代理中手动去配置各种各样的系统工具和依赖。

```js
Jenkinsfile (Declarative Pipeline)
pipeline {
  agent {
    docker { image 'node' }
  },
  stages {
    stage('Test') {
      steps:{
        sh "node --version"
      }
    }
  }
}
```
当执行 Pipeline 时，Jenkins 将会自动运行指定的容器，并执行 Pipeline 中已经定义好的步骤 Steps。

## 使用环境变量

环境变量可以像下面的示例设置为全局的，也可以是阶段级别的。阶段级别的环境变量只能在定义变量的阶段 stage 使用。

```js
Jenkinsfile(Declarative Pipeline)
pipeline {
  agent any
  environment {
    DISABLE_AUTH = 'true'
    DB_ENIGINE = 'sqllite'
  }
  stages {
    stage('Build') {
      steps {
        sh 'printenv'
      }
    }
  }
}
```

这种在 Jenkinsfile 中定义环境变量的方法对于指令性的脚本定义非常有用和方便。可以在 pipeline 中配置构建或者测试的环境，然后再 Jenkins 中运行。

环境变量的另一个常见的用途是设置或覆盖构建或测试脚本的凭证。