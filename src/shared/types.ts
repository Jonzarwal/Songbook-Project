export type List = {
  id: number;
  name: string;
  description?: string;
  color?: string;
};

export type Song = {
  id: number;
  title: string;
  artist?: string;
  yt_url?: string;
  lyrics?: string;
  notes?: string;
};

export type ListSong = Song & {
  position: number;
  color?: string;
  notes?: string; // le notes de list_songs, pas de songs
};
