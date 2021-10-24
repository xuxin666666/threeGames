import { StyleCeil, StyleTetrisStage } from "./StyleTetris"
import { Tetrimino } from "./Tetrimino"

const Display = ({ stage }) => {
    return (
        <StyleTetrisStage rows={stage.length} columns={stage[0].length}>
            {stage.map(item =>
                item.map((ceil, index) =>
                    <StyleCeil color={Tetrimino[ceil.type || ceil].color} key={index} />
                )
            )}
        </StyleTetrisStage>
    )
}

export default Display