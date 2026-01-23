// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Input } from './input';

const meta = {
    title: 'UI/Card',
    component: Card,
    tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Simple: Story = {
    render: (args) => (
        <Card className="w-[350px]" {...args}>
            <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Input id="name" placeholder="Name of your project" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
            </CardFooter>
        </Card>
    ),
};

export const Interactive: Story = {
    render: () => (
        <Card className="w-[400px] hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Hover over me to see the shadow effect.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>This demonstrates how cards can be composed for richer UIs.</p>
            </CardContent>
        </Card>
    )
}
