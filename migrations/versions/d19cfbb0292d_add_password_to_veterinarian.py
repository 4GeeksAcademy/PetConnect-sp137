"""Add password to veterinarian

Revision ID: d19cfbb0292d
Revises: 949923954277
Create Date: 2026-08-02 22:41:08.470983

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd19cfbb0292d'
down_revision = '949923954277'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('veterinarian', schema=None) as batch_op:
        batch_op.add_column(sa.Column('password', sa.String(), nullable=False))

def downgrade():
    with op.batch_alter_table('veterinarian', schema=None) as batch_op:
        batch_op.drop_column('password')