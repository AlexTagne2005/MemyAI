import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';
import React from 'react';

describe('Header Component', () => {
  it('renders the branding elements correctly', () => {
    render(
      <Header
        onOpenAiModal={() => {}}
        onOpenSavedModal={() => {}}
        onOpenHelpModal={() => {}}
        savedCount={0}
      />
    );
    expect(screen.getByText(/MemeAI/i)).toBeInTheDocument();
    expect(screen.getByText(/Magic/i)).toBeInTheDocument();
    expect(screen.getByText(/3.6 Flash/i)).toBeInTheDocument();
  });

  it('calls onOpenAiModal when the AI Image Generator button is clicked', () => {
    const handleOpenAiModal = vi.fn();
    render(
      <Header
        onOpenAiModal={handleOpenAiModal}
        onOpenSavedModal={() => {}}
        onOpenHelpModal={() => {}}
        savedCount={0}
      />
    );

    const button = screen.getByTitle(/Generate custom meme image background using AI prompt/i);
    fireEvent.click(button);
    expect(handleOpenAiModal).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenSavedModal when the My Memes button is clicked', () => {
    const handleOpenSavedModal = vi.fn();
    render(
      <Header
        onOpenAiModal={() => {}}
        onOpenSavedModal={handleOpenSavedModal}
        onOpenHelpModal={() => {}}
        savedCount={0}
      />
    );

    const button = screen.getByTitle(/Saved Memes Gallery/i);
    fireEvent.click(button);
    expect(handleOpenSavedModal).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenHelpModal when the Help button is clicked', () => {
    const handleOpenHelpModal = vi.fn();
    render(
      <Header
        onOpenAiModal={() => {}}
        onOpenSavedModal={() => {}}
        onOpenHelpModal={handleOpenHelpModal}
        savedCount={0}
      />
    );

    const button = screen.getByTitle(/How Magic AI Meme Generator Works/i);
    fireEvent.click(button);
    expect(handleOpenHelpModal).toHaveBeenCalledTimes(1);
  });

  it('displays the savedCount badge when savedCount > 0', () => {
    render(
      <Header
        onOpenAiModal={() => {}}
        onOpenSavedModal={() => {}}
        onOpenHelpModal={() => {}}
        savedCount={5}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not display the savedCount badge when savedCount is 0', () => {
    render(
      <Header
        onOpenAiModal={() => {}}
        onOpenSavedModal={() => {}}
        onOpenHelpModal={() => {}}
        savedCount={0}
      />
    );

    const badge = screen.queryByText('0');
    expect(badge).not.toBeInTheDocument();
  });
});
