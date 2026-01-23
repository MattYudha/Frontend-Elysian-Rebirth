// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

const meta = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean',
        },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: 'Type something...',
    },
};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Email address',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Password',
    },
};

export const Disabled: Story = {
    args: {
        placeholder: 'Disabled input',
        disabled: true,
    },
};

export const WithLabel: Story = {
    render: (args) => (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
            <Input {...args} id="email" />
        </div>
    ),
    args: {
        type: 'email',
        placeholder: 'Email',
    },
};
