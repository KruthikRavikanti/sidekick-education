CREATE TABLE retired_skill_states (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 status TEXT NOT NULL,
 state_json TEXT NOT NULL,
 updated_at REAL NOT NULL,
 retired_at REAL NOT NULL,
 PRIMARY KEY(kid_id,subskill_id)
);
INSERT INTO retired_skill_states SELECT kid_id,subskill_id,status,state_json,updated_at,CAST(strftime('%s','now') AS REAL) FROM skill_states;
DROP TABLE skill_states;
CREATE TABLE skill_states (
 kid_id TEXT NOT NULL REFERENCES kid_profiles(id) ON DELETE CASCADE,
 subskill_id TEXT NOT NULL REFERENCES catalog_subskills(id),
 status TEXT NOT NULL CHECK(status IN ('unassessed','on_track','needs_support')),
 state_json TEXT NOT NULL,
 updated_at REAL NOT NULL,
 PRIMARY KEY(kid_id,subskill_id)
);
WITH keys AS (
 SELECT kid_id,subskill_id FROM retired_skill_states
 UNION
 SELECT kid_id,subskill_id FROM learning_evidence WHERE source='homework' AND subskill_id IS NOT NULL
), observations AS (
 SELECT kid_id,subskill_id,
 json_group_object(COALESCE(fingerprint,source_ref),correctness) AS facts,
 SUM(CASE WHEN correctness='incorrect' THEN 1 ELSE 0 END) AS incorrect_count,
 SUM(CASE WHEN correctness='correct' THEN 1 ELSE 0 END) AS correct_count,
 MAX(id) AS last_event_seq,MAX(created_at) AS updated_at
 FROM learning_evidence WHERE source='homework' AND eligible=1 AND correctness IN ('correct','incorrect') AND subskill_id IS NOT NULL
 GROUP BY kid_id,subskill_id
), current_states AS (
 SELECT k.kid_id,k.subskill_id,
 CASE WHEN COALESCE(o.incorrect_count,0)>=2 THEN 'needs_support' WHEN COALESCE(o.correct_count,0)>0 THEN 'on_track' ELSE 'unassessed' END AS status,
 COALESCE(o.facts,'{}') AS facts,COALESCE(o.incorrect_count,0) AS incorrect_count,
 COALESCE(o.correct_count,0) AS correct_count,COALESCE(o.last_event_seq,0) AS last_event_seq,
 COALESCE(o.updated_at,CAST(strftime('%s','now') AS REAL)) AS updated_at
 FROM keys k LEFT JOIN observations o ON o.kid_id=k.kid_id AND o.subskill_id=k.subskill_id
)
INSERT INTO skill_states SELECT kid_id,subskill_id,status,
 json_object('status',status,'observations',json(facts),'incorrect_count',incorrect_count,'correct_count',correct_count,'last_event_seq',last_event_seq),updated_at FROM current_states;
UPDATE practice_assignments SET status='cancelled',preparation_until=NULL,preparation_error='workflow_removed' WHERE status IN ('awaiting_items','open');
UPDATE learning_sessions SET state='completed',completed_at=COALESCE(completed_at,CAST(strftime('%s','now') AS REAL)) WHERE state='open';
UPDATE gap_chains SET status='completed',current_target_id=NULL,stop_reason='standalone_practice_removed',updated_at=CAST(strftime('%s','now') AS REAL) WHERE status!='completed';
