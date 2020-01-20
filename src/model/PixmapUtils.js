import Pixmap from "./Pixmap";

export default class PixmapUtils {
    static buildCheckerBoardTile(size, color1, color2) {
        const totalSize = 2 * size;
        const pixmap = Pixmap.create(totalSize, totalSize);
        pixmap.drawPoint(0, 0, totalSize, color1);
        pixmap.drawPoint(0, 0, size, color2);
        pixmap.drawPoint(size, size, size, color2);
        return pixmap;
    }
}