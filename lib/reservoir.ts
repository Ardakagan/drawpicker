import type { User } from "./types";

// Akış halinde gelen N katılımcıdan, hepsini bellekte tutmadan
// k tanesini eşit olasılıkla (adil) seçer.
export class Reservoir {
  private items: User[] = [];
  private seen = 0;

  constructor(private k: number) {
    this.k = Math.max(1, k);
  }

  add(u: User) {
    this.seen++;
    if (this.items.length < this.k) {
      this.items.push(u);
    } else {
      const j = Math.floor(Math.random() * this.seen);
      if (j < this.k) this.items[j] = u;
    }
  }

  shuffled(): User[] {
    return [...this.items].sort(() => Math.random() - 0.5);
  }
}
