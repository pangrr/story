import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MemoriesDialogComponent } from '../memories-dialog/memories-dialog.component';
import { Memory } from '../memory';
import { Scene } from '../scene';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Action } from '../action';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;

  constructor(
    private service: GameService,
    public memoriesDialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'recall',
      sanitizer.bypassSecurityTrustResourceUrl('assets/recall.svg'));
  }

  ngOnInit() {
    this.game = this.service.getGame();
  }

  takeAction(action: Action): void {
    if (action.recallMemoryTitles) {
      this.recallMemory(action.recallMemoryTitles);
    }
    if (action.nextSceneTitle) {
      this.nextScene(action.nextSceneTitle);
    }
  }

  getCurrentScene(): Scene {
    for (const scene of this.game.scenes) {
      if (scene.title === this.game.currentSceneTitle) {
        return scene;
      }
    }
  }

  recallMemory(memoryTitles: string[]): void {
    this.addToCurrentMemoryIfNotExist(memoryTitles);

    this.memoriesDialog.open(MemoriesDialogComponent, {
      width: '800px',
      data: {
        memories: this.collectCurrentMemories(),
        memoryTitles
      }
    });
  }

  private nextScene(sceneTitle: string): void {
    this.game.currentSceneTitle = sceneTitle;
  }

  private collectCurrentMemories(): Memory[] {
    return this.game.currentMemoryTitles.map(title => this.getMemoryByTitle(title));
  }

  private addToCurrentMemoryIfNotExist(memoryTitles: string[]): void {
    memoryTitles.forEach(memoryTitle => {
      if (!this.game.currentMemoryTitles.includes(memoryTitle)) {
        this.game.currentMemoryTitles.push(memoryTitle);
      }
    });
  }

  private getMemoryByTitle(title: string): Memory {
    for (const memory of this.game.memories) {
      if (memory.title === title) {
        return memory;
      }
    }
  }
}

