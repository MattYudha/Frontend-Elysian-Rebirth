'use client';

import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, ConnectionMode, NodeTypes, Controls, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { useTheme } from 'next-themes';

// Custom Nodes imported from workflow module
import { LLMNode } from '@/components/workflow/nodes/LLMNode';
import { BranchNode } from '@/components/workflow/nodes/BranchNode';
import { TextNode } from '@/components/workflow/nodes/TextNode';
import { DocumentNode } from '@/components/workflow/nodes/DocumentNode';
import { StartNode } from '@/components/workflow/nodes/StartNode';
import { AgentNode } from '@/components/workflow/nodes/AgentNode';
import { DataIngestionNode } from '@/components/workflow/nodes/DataIngestionNode';
import { GuardrailNode } from '@/components/workflow/nodes/GuardrailNode';
import { AnimatedEdge } from '@/components/workflow/edges/AnimatedEdge';

const nodeTypes: NodeTypes = {
  llm: LLMNode,
  branch: BranchNode,
  text: TextNode,
  document: DocumentNode,
  start: StartNode,
  agent: AgentNode,
  data_ingestion: DataIngestionNode,
  guardrail: GuardrailNode,
  startTrigger: StartNode,
  sqlConnector: DataIngestionNode,
  fraudVerify: GuardrailNode,
  llm_agent: LLMNode,
  rag_retriever: DataIngestionNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const staticNodes = [
  {
    id: 'start-1',
    type: 'start',
    data: { label: 'Start Trigger' },
    position: { x: 30, y: 150 },
  },
  {
    id: 'ingest-1',
    type: 'data_ingestion',
    data: { label: 'Telemetry Ingest' },
    position: { x: 210, y: 150 },
  },
  {
    id: 'coordinator-1',
    type: 'agent',
    data: { label: 'Audit Coordinator' },
    position: { x: 390, y: 150 },
  },
  {
    id: 'compliance-1',
    type: 'guardrail',
    data: { label: 'POJK Guardrail' },
    position: { x: 570, y: 70 },
  },
  {
    id: 'markup-1',
    type: 'guardrail',
    data: { label: 'Markup Auditor' },
    position: { x: 570, y: 230 },
  },
  {
    id: 'report-1',
    type: 'document',
    data: { label: 'Reporting Swarm' },
    position: { x: 750, y: 150 },
  },
];

const staticEdges = [
  { id: 'e1-2', source: 'start-1', target: 'ingest-1', type: 'animated', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e2-3', source: 'ingest-1', target: 'coordinator-1', type: 'animated', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e3-4', source: 'coordinator-1', target: 'compliance-1', type: 'animated', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e3-5', source: 'coordinator-1', target: 'markup-1', type: 'animated', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e4-6', source: 'compliance-1', target: 'report-1', type: 'animated', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e5-6', source: 'markup-1', target: 'report-1', type: 'animated', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
];

interface ReadOnlyWorkflowCanvasProps {
  nodes?: any[];
  edges?: any[];
  onNodeDragStop?: (event: any, node: any, nodes: any[]) => void;
}

export default function ReadOnlyWorkflowCanvas({ nodes, edges, onNodeDragStop }: ReadOnlyWorkflowCanvasProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [rfNodes, setRFNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRFEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      setRFNodes(nodes);
    } else {
      setRFNodes(staticNodes);
    }
  }, [nodes, setRFNodes]);

  useEffect(() => {
    if (edges && edges.length > 0) {
      setRFEdges(edges);
    } else {
      setRFEdges(staticEdges);
    }
  }, [edges, setRFEdges]);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-100 dark:bg-slate-950/20 animate-pulse flex items-center justify-center">
        <span className="text-slate-500 dark:text-slate-400 text-xs">Loading workflow layout...</span>
      </div>
    );
  }

  const defaultEdgeOptions = {
    type: 'animated',
    animated: true,
  };

  return (
    <div className="h-full w-full bg-transparent relative">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        className="bg-transparent"
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnDrag={true}
        preventScrolling={true}
        onNodeDragStop={onNodeDragStop ? (e, node) => onNodeDragStop(e, node, rfNodes) : undefined}
      >
        <Background color={theme === 'dark' ? '#1e293b' : '#94a3b8'} gap={20} size={1} />
        <Controls 
          showInteractive={false} 
          className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-white/10 rounded-md shadow-lg overflow-hidden [&_button]:bg-slate-50 dark:[&_button]:bg-slate-900 [&_button]:border-b [&_button]:border-slate-200 dark:[&_button]:border-white/5 [&_button]:text-slate-600 dark:[&_button]:text-slate-300 hover:[&_button]:bg-slate-100 dark:hover:[&_button]:bg-slate-800 hover:[&_button]:text-slate-900 dark:hover:[&_button]:text-white [&_button]:transition-colors [&_svg]:fill-slate-600 dark:[&_svg]:fill-slate-300" 
        />
      </ReactFlow>
    </div>
  );
}
