import css from './../style.sss'
import React from 'react'
import { Task as TaskSchema } from 'libs/storage/schemas'
import { Task, ArchivedTask } from './'

const Tasks = ({ tasks, isArchivedScope = false }) => {
  const statusNames = TaskSchema.enums.statuses
  const ATask = isArchivedScope ? ArchivedTask : Task
  return (
    <article>
      <ul className={ css.tasks }>
        { tasks.map((task) => <ATask { ...{ task, statusNames, key: task.uuid } } />) }
      </ul>
    </article>
  )
}

export default Tasks
