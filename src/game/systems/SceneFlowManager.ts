import { LINEAR_FLOW } from '../data/sceneFlowData';
import { useGameStore } from '../../store/gameStore';

// Manages the game's scene progression
export class SceneFlowManager {
  private currentFlowIndex = 0;

  getCurrentFlowIndex(): number {
    return this.currentFlowIndex;
  }

  setFlowIndex(index: number) {
    this.currentFlowIndex = Math.max(0, Math.min(index, LINEAR_FLOW.length - 1));
  }

  getNextScene(): { scene: string; data?: Record<string, unknown> } | null {
    if (this.currentFlowIndex >= LINEAR_FLOW.length - 1) return null;
    this.currentFlowIndex++;
    return LINEAR_FLOW[this.currentFlowIndex];
  }

  getPreviousScene(): { scene: string; data?: Record<string, unknown> } | null {
    if (this.currentFlowIndex <= 0) return null;
    this.currentFlowIndex--;
    return LINEAR_FLOW[this.currentFlowIndex];
  }

  getCurrentScene(): { scene: string; data?: Record<string, unknown> } {
    return LINEAR_FLOW[this.currentFlowIndex];
  }

  getProgress(): number {
    return (this.currentFlowIndex / (LINEAR_FLOW.length - 1)) * 100;
  }

  // Find the flow index for a given scene key and data
  findFlowIndex(sceneKey: string, data?: Record<string, unknown>): number {
    return LINEAR_FLOW.findIndex((entry) => {
      if (entry.scene !== sceneKey) return false;
      if (!data && !entry.data) return true;
      if (!data || !entry.data) return false;
      return JSON.stringify(entry.data) === JSON.stringify(data);
    });
  }

  // Check if a particular game milestone has been reached
  static checkMilestone(milestone: string): boolean {
    const state = useGameStore.getState();
    switch (milestone) {
      case 'bankOpened':
        return state.bankAccountOpened;
      case 'firstTrade':
        return state.tradesCompleted >= 1;
      case 'secondTrade':
        return state.tradesCompleted >= 2;
      case 'thirdTrade':
        return state.tradesCompleted >= 3;
      case 'guruMet':
        return state.guruMeetingComplete;
      case 'barMitzvah':
        return state.barMitzvahComplete;
      case 'hasComputer':
        return state.hasComputer;
      default:
        return false;
    }
  }
}

// Singleton instance
export const sceneFlowManager = new SceneFlowManager();
