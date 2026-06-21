export enum WineColor {
  Red = 'red',
  White = 'white',
  Rose = 'rose',
  Sparkling = 'sparkling',
  Sweet = 'sweet',
  Orange = 'orange',
}

export const WINE_COLOR_LABELS: Record<WineColor, string> = {
  [WineColor.Red]: 'Rouge',
  [WineColor.White]: 'Blanc',
  [WineColor.Rose]: 'Rosé',
  [WineColor.Sparkling]: 'Pétillant',
  [WineColor.Sweet]: 'Doux / Liquoreux',
  [WineColor.Orange]: 'Orange',
}
