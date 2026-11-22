ALTER TABLE activity_program_generations ADD COLUMN game_design_json TEXT;
ALTER TABLE activity_program_generations ADD COLUMN design_evaluations_json TEXT;
ALTER TABLE activity_program_generations ADD COLUMN gameplay_review_json TEXT;
ALTER TABLE activity_program_generations ADD COLUMN structural_fingerprint_json TEXT;
ALTER TABLE activity_program_generations ADD COLUMN render_manifest_json TEXT;
ALTER TABLE activity_program_generations ADD COLUMN duration_ms INTEGER;
