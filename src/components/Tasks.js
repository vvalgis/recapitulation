import React from 'react'
import { DataSchema } from 'main'
import { Task, ArchivedTask } from 'components'

const Tasks = ({ tasks, isArchivedScope = false }) => {
  const statusNames = DataSchema.Task.enums.statuses
  const ATask = isArchivedScope ? ArchivedTask : Task
  return (
    <article>
      <ul className="tasks">
        { tasks.map((task) => <ATask { ...{ task, statusNames, key: task.uuid } } />) }
      </ul>
    </article>
  )
}

export default Tasks
