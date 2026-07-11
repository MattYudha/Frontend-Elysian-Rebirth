'use client';

import { useMemo, useState, useEffect, useRef } from "react"
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import { AgentTaskCard, PipelineAgentTask, AgentTaskStatus } from "./AgentTaskCard"
import { PipelineColumn } from "./PipelineColumn"
import { useMoveWorkstreamStage } from "@/hooks/useWorkstreams"

export type PipelineBoardProps = {
    initialTasks: PipelineAgentTask[]
}

const COLUMNS: { id: AgentTaskStatus; title: string }[] = [
    { id: "data_ingestion", title: "Data Ingestion" },
    { id: "processing", title: "Thinking/Processing" },
    { id: "final_review", title: "Final Review" },
]

export function PipelineBoard({ initialTasks }: PipelineBoardProps) {
    const [tasks, setTasks] = useState<PipelineAgentTask[]>(initialTasks)
    const [activeId, setActiveId] = useState<string | null>(null)
    const isDragging = useRef(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const { mutate: moveStage } = useMoveWorkstreamStage();

    // Only sync from props if NOT currently dragging
    // This prevents the 10-second refetch from resetting the board mid-drag
    useEffect(() => {
        if (!isDragging.current) {
            setTasks(initialTasks);
        }
    }, [initialTasks]);

    const columns = useMemo(() => {
        return COLUMNS.map(col => ({
            ...col,
            tasks: tasks.filter(t => t.status === col.id)
        }))
    }, [tasks])

    function handleDragStart(event: DragStartEvent) {
        isDragging.current = true
        setActiveId(event.active.id as string)
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeTaskId = active.id as string
        const overId = over.id as string

        if (activeTaskId === overId) return

        const isActiveTask = active.data.current?.type === "Task"
        const isOverTask = over.data.current?.type === "Task"
        const isOverColumn = over.data.current?.type === "Column"

        if (!isActiveTask) return

        // Dropping over another Task in a different column → move column, reorder
        if (isActiveTask && isOverTask) {
            setTasks(prev => {
                const activeIndex = prev.findIndex(t => t.id === activeTaskId)
                const overIndex = prev.findIndex(t => t.id === overId)
                if (activeIndex === -1 || overIndex === -1) return prev

                if (prev[activeIndex].status !== prev[overIndex].status) {
                    const updated = prev.map((t, i) =>
                        i === activeIndex ? { ...t, status: prev[overIndex].status } : t
                    )
                    return arrayMove(updated, activeIndex, overIndex)
                }

                return arrayMove(prev, activeIndex, overIndex)
            })
        }

        // Dropping over an empty column area
        if (isActiveTask && isOverColumn) {
            const newStatus = overId as AgentTaskStatus
            setTasks(prev => {
                const activeIndex = prev.findIndex(t => t.id === activeTaskId)
                if (activeIndex === -1) return prev
                if (prev[activeIndex].status === newStatus) return prev

                return prev.map((t, i) =>
                    i === activeIndex ? { ...t, status: newStatus } : t
                )
            })
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        isDragging.current = false
        setActiveId(null)

        if (!over) return

        const activeTaskId = active.id as string

        // Find the final status of the dragged task and commit it via mutation
        const movedTask = tasks.find(t => t.id === activeTaskId)
        if (movedTask) {
            moveStage({ id: activeTaskId, newStatus: movedTask.status })
        }
    }

    const activeTask = useMemo(
        () => tasks.find((task) => task.id === activeId),
        [activeId, tasks]
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 md:gap-6 mt-6 overflow-x-auto pb-8 snap-x snap-mandatory">
                {columns.map(column => (
                    <PipelineColumn key={column.id} column={column} tasks={column.tasks} />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <AgentTaskCard task={activeTask} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    )
}
