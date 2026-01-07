'use client'

import { Code, Users } from 'lucide-react'
import styles from './ProjectBox.module.css'

interface Project {
  name: string
  description: string
  icon: React.ReactNode
  color: string
  link?: string
}

export default function ProjectBox() {
  const projects: Project[] = [
    {
      name: 'Imperia Script',
      description: 'Script Development',
      icon: <Code size={18} />,
      color: '#00ffff',
    },
    {
      name: 'Noctyra Clan',
      description: 'Gaming Community',
      icon: <Users size={18} />,
      color: '#ff00ff',
    },
  ]

  return (
    <div className={styles.projectBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>Projects</h3>
      </div>
      <div className={styles.projectsList}>
        {projects.map((project, index) => (
          <div
            key={index}
            className={styles.projectItem}
            style={{ '--project-color': project.color } as React.CSSProperties}
          >
            <div className={styles.projectIcon} style={{ color: project.color }}>
              {project.icon}
            </div>
            <div className={styles.projectInfo}>
              <div className={styles.projectName}>{project.name}</div>
              <div className={styles.projectDescription}>{project.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

