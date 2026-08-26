"""Initial migration for AnalysisHistory table

Revision ID: 001_initial
Revises: 
Create Date: 2026-08-26 19:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'analysis_history',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('request_id', sa.String(length=64), nullable=True),
        sa.Column('image_hash', sa.String(length=64), nullable=True),
        sa.Column('filename', sa.String(length=255), nullable=True),
        sa.Column('predicted_class', sa.String(length=100), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('is_certain', sa.Boolean(), nullable=True, server_default=sa.text('true')),
        sa.Column('blur_score', sa.Float(), nullable=True),
        sa.Column('processing_time_ms', sa.Float(), nullable=True),
        sa.Column('top3_probs', sa.JSON(), nullable=False),
        sa.Column('full_response', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_analysis_history_id'), 'analysis_history', ['id'], unique=False)
    op.create_index(op.f('ix_analysis_history_request_id'), 'analysis_history', ['request_id'], unique=False)
    op.create_index(op.f('ix_analysis_history_image_hash'), 'analysis_history', ['image_hash'], unique=False)
    op.create_index(op.f('ix_analysis_history_predicted_class'), 'analysis_history', ['predicted_class'], unique=False)
    op.create_index(op.f('ix_analysis_history_created_at'), 'analysis_history', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_analysis_history_created_at'), table_name='analysis_history')
    op.drop_index(op.f('ix_analysis_history_predicted_class'), table_name='analysis_history')
    op.drop_index(op.f('ix_analysis_history_image_hash'), table_name='analysis_history')
    op.drop_index(op.f('ix_analysis_history_request_id'), table_name='analysis_history')
    op.drop_index(op.f('ix_analysis_history_id'), table_name='analysis_history')
    op.drop_table('analysis_history')
