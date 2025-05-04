const db = require("../config/db");

/**
 * 디렉토리의 전체 경로를 만들어주는 함수
 * @param {number} directoryId
 * @returns
 */
async function buildFullPath(directoryId) {
  let pathSegments = [];
  let currentId = directoryId;

  while (currentId) {
    const [rows] = await db.execute(
      "SELECT id, parent_id, directory_name FROM directory WHERE id = ?",
      [currentId]
    );

    if (rows.length === 0) break;

    const dir = rows[0];
    pathSegments.unshift(dir.directory_name);
    currentId = dir.parent_id;
  }

  return "/" + pathSegments.join("/");
}

/**
 * 하위 디렉토리를 재귀 업데이트
 * @param {number} directoryId
 */
async function updateFullPathRecursively(directoryId) {
  const fullPath = await buildFullPath(directoryId);

  // 현재 디렉토리 업데이트
  await db.execute("UPDATE directory SET full_path = ? WHERE id = ?", [
    fullPath,
    directoryId,
  ]);

  // 자식 디렉토리 찾기
  const [children] = await db.execute(
    "SELECT id FROM directory WHERE parent_id = ?",
    [directoryId]
  );

  for (const child of children) {
    await updateFullPathRecursively(child.id, db); // 재귀 호출
  }
}

exports.create = async (req, res) => {
  const { parentId, directoryName } = req.body;

  // 금지 문자: \ / : * ? " < > |
  const invalidCharsRegex = /[\\/:*?"<>|]/;

  // 끝이 공백 또는 마침표인지 검사
  const endsWithSpaceOrDot = /[. ]$/;

  if (invalidCharsRegex.test(directoryName)) {
    return res
      .status(400)
      .json({ message: `/ : * ? " < > | 문자는 사용할 수 없습니다.` });
  }

  if (endsWithSpaceOrDot.test(directoryName)) {
    return res
      .status(400)
      .json({ message: "이름의 끝에 공백을 입력할 수 없습니다." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id FROM directory WHERE directory_name = ?",
      [directoryName]
    );

    if (rows.length > 0) {
      return res
        .status(409)
        .json({ message: "동일한 이름의 디렉토리가 존재합니다." });
    }

    const fullPath = await buildFullPath(parentId);

    await db.execute(
      "INSERT INTO directory (parent_id, directory_name, full_path) VALUES (?, ?, ?)",
      [parentId, directoryName, fullPath]
    );

    return res.status(201).json({ message: "디렉토리 생성 성공" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "디렉토리 생성 실패" });
  }
};

exports.updateDirectoryName = async (req, res) => {
  const { id } = req.params;
  const { directoryName } = req.body;

  // 금지 문자: \ / : * ? " < > |
  const invalidCharsRegex = /[\\/:*?"<>|]/;

  // 끝이 공백 또는 마침표인지 검사
  const endsWithSpaceOrDot = /[. ]$/;

  if (invalidCharsRegex.test(directoryName)) {
    return res
      .status(400)
      .json({ message: `/ : * ? " < > | 문자는 사용할 수 없습니다.` });
  }

  if (endsWithSpaceOrDot.test(directoryName)) {
    return res
      .status(400)
      .json({ message: "이름의 끝에 공백을 입력할 수 없습니다." });
  }

  try {
    // 기존 디렉토리 존재 여부 확인
    const [rows] = await db.execute("SELECT * FROM directory WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 디렉토리를 찾을 수 없습니다." });
    }

    // 이름 변경
    await db.execute("UPDATE directory SET directory_name = ? WHERE id = ?", [
      directoryName,
      id,
    ]);

    await updateFullPathRecursively(Number(id));

    return res.status(200).json({ message: "디렉토리 이름이 변경되었습니다." });
  } catch (e) {
    console.log(e);

    return res
      .status(500)
      .json({ message: "디렉토리 이름 변경 중 오류가 발생했습니다." });
  }
};
